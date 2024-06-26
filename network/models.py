from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    pass


class Posts(models.Model):
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(max_length=256)
    time = models.DateTimeField(default=datetime.now())

    def __str__(self):
        return f'{self.poster} posted "{self.content}" at {self.time}'


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name="likes")
    time = models.TimeField(default=datetime.now())

    def __str__(self):
        return f"{self.user} liked {self.post} at {self.time}"


class Follower(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following"
    )
    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )

    def __str__(self):
        return f"{self.follower} started following {self.following}"
    

class Tag(models.Model):
    tag = models.CharField(max_length=50)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name="post")

    def __str__(self):
        return f"{self.tag}:{self.post}"
    
class UserPic(models.Model):
    pic = models.ImageField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def delete(self, *args, **kwargs):
       self.pic.delete()
       super().delete(*args, **kwargs)

class UserBio(models.Model):
    bio = models.TextField(max_length=256)
    user = models.ForeignKey(User, on_delete=models.CASCADE)