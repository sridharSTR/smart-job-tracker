import re

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import JobApplication, JobPost, Notification, Resume, Skill

User = get_user_model()


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.SerializerMethodField()
    applicant_resumes = serializers.SerializerMethodField()
    source_job = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def to_internal_value(self, data):
        data = data.copy()
        for field in ("salary_offered", "interview_date", "deadline"):
            if data.get(field) == "":
                data[field] = None
        return super().to_internal_value(data)

    def get_applicant(self, obj):
        user = obj.user
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": user.get_full_name() or user.username,
            "avatar": user.avatar.url if getattr(user, "avatar", None) else "",
            "bio": user.bio,
            "experience": user.experience,
            "education": user.education,
        }

    def get_applicant_resumes(self, obj):
        return ResumeSerializer(obj.user.resumes.all(), many=True, context=self.context).data

    def get_source_job(self, obj):
        job = obj.job_post
        if not job:
            return None
        return {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "recruiter": job.recruiter_id,
        }


class ResumeSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ["id", "title", "file", "file_url", "is_primary", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_file_url(self, obj):
        if not obj.file:
            return ""
        request = self.context.get("request")
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(write_only=True, required=False)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "user", "user_email", "recipient_email", "title", "message", "due_at", "is_read", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def validate_recipient_email(self, value):
        user = User.objects.filter(email__iexact=value).first()
        if not user:
            raise serializers.ValidationError("No registered user found with this email.")
        return value

    def validate(self, attrs):
        recipient_email = attrs.pop("recipient_email", None)
        if recipient_email:
            attrs["recipient_user"] = User.objects.get(email__iexact=recipient_email)
        return attrs


class JobPostSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    skill_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    recruiter_name = serializers.CharField(source="recruiter.username", read_only=True)

    class Meta:
        model = JobPost
        fields = ["id", "recruiter", "recruiter_name", "title", "company", "location", "workplace", "salary_range", "description", "skills", "skill_names", "is_active", "created_at"]
        read_only_fields = ["id", "recruiter", "created_at"]

    def create(self, validated_data):
        names = validated_data.pop("skill_names", [])
        post = JobPost.objects.create(**validated_data)
        self._set_skills(post, names)
        return post

    def update(self, instance, validated_data):
        names = validated_data.pop("skill_names", None)
        post = super().update(instance, validated_data)
        if names is not None:
            self._set_skills(post, names)
        return post

    def _set_skills(self, post, names):
        skills = [Skill.objects.get_or_create(name=name.strip().title())[0] for name in names if name.strip()]
        post.skills.set(skills)


class ResumeMatchSerializer(serializers.Serializer):
    resume_text = serializers.CharField(required=False, allow_blank=True)
    job_description = serializers.CharField()

    def validate(self, attrs):
        if not attrs.get("resume_text") and not self.context["request"].FILES.get("resume"):
            raise serializers.ValidationError("Provide resume text or upload a resume file.")
        return attrs

    def score(self):
        resume_text = self.validated_data.get("resume_text", "")
        uploaded = self.context["request"].FILES.get("resume")
        if uploaded:
            resume_text += " " + uploaded.name.replace("_", " ")
        jd_words = self._keywords(self.validated_data["job_description"])
        resume_words = self._keywords(resume_text)
        matched = sorted(jd_words & resume_words)
        missing = sorted(jd_words - resume_words)[:20]
        score = round((len(matched) / max(len(jd_words), 1)) * 100)
        return {"score": score, "matched_keywords": matched[:30], "missing_skills": missing}

    def _keywords(self, text):
        stop = {"and", "the", "with", "for", "you", "are", "our", "will", "this", "that", "from", "have", "has", "into"}
        return {word.lower() for word in re.findall(r"[A-Za-z][A-Za-z+#.]{2,}", text) if word.lower() not in stop}
