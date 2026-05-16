from django.db import migrations, models
import django.db.models.deletion


def mark_existing_users_verified(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    User.objects.update(is_email_verified=True, is_active=True)


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_update_user_roles"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_email_verified",
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name="EmailOTP",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("purpose", models.CharField(choices=[("REGISTER", "Register"), ("LOGIN", "Login")], max_length=20)),
                ("code_hash", models.CharField(max_length=128)),
                ("expires_at", models.DateTimeField()),
                ("is_used", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="email_otps", to="accounts.user"),
                ),
            ],
        ),
        migrations.AddIndex(
            model_name="emailotp",
            index=models.Index(fields=["user", "purpose", "is_used", "expires_at"], name="accounts_em_user_id_03bd3a_idx"),
        ),
        migrations.RunPython(mark_existing_users_verified, migrations.RunPython.noop),
    ]
