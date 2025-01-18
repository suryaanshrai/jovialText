from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import requests
import uuid

def validate_image_url(value):
    try:
        response = requests.head(value, timeout=5)
        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('image/'):
            raise ValidationError('The URL must point to a valid image.')
    except requests.RequestException:
        raise ValidationError('Could not validate the image URL.')
    
    # allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']
    # if not any(value.lower().endswith(ext) for ext in allowed_extensions):
    #     raise ValidationError('The URL must end with a valid image file extension.')

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bio = models.TextField(max_length=128, blank=True)
    pic = models.URLField(blank=True, validators=[validate_image_url])

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    content = models.TextField(max_length=2048)
    pic = models.URLField(blank=True, validators=[validate_image_url])
    time = models.DateTimeField(auto_now_add=True)
    # tag = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f'{self.content}'


class Like(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    time = models.TimeField(auto_now_add=True)

    class Meta:
        unique_together = ('username', 'post')

    def __str__(self):
        return f"{self.username} likes {self.post}"


class Follower(models.Model):
    username = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following"
    )
    follow = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )

    class Meta:
        unique_together = ('username', 'follow')

    def __str__(self):
        return f"{self.username} follows {self.follow}"