from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import requests
import uuid

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def validate_image_url(value):
    try:
        response = requests.head(value, timeout=5)
        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('image/'):
            raise ValidationError('The URL must point to a valid image.')
    except requests.RequestException:
        raise ValidationError('Could not validate the image URL.')
    

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bio = models.TextField(max_length=128, blank=True)
    pic = models.URLField(blank=True, validators=[validate_image_url])


class Follower(models.Model):
    username = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following"
    )
    follow = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )
    created = models.TimeField(auto_now_add=True)

    class Meta:
        unique_together = ('username', 'follow')

    def __str__(self):
        return f"{self.username} -> {self.follow}"


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    content = models.TextField(max_length=2048)
    pic = models.URLField(blank=True, validators=[validate_image_url])
    sentiment = models.FloatField(editable=False, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = [
        ('PUB', 'Published'),
        ('SCH', 'Scheduled'),
        ('ACH', 'Archived'),
    ]
    status = models.CharField(choices=STATUS_CHOICES, default='PUB')

    def get_like_count(self,):
        return Like.objects.filter(post=self).count()

    def get_replies(self,):
        return Reply.objects.filter(post=self)
    
    def save(self,*args, **kwargs):
        self.sentiment = SentimentIntensityAnalyzer().polarity_scores(self.title+self.content)['compound']
        super().save(*args, **kwargs)
        
        mentions = [word[1:] for word in self.content.split() if word.startswith('@') and User.objects.filter(username=word[1:])]
        for mention in mentions: Mention.objects.get_or_create(
                username=User.objects.get(username=self.username), 
                mention=User.objects.get(username=mention),
                post=self,
            )
                
        tags = [word.lower()[1:] for word in self.content.split() if word.startswith('#')]
        for tag in tags: Tag.objects.get_or_create(tag=tag, post=self)

    def __str__(self):
        return f'{self.title}'


class Reply(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.CharField(max_length=500)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Replies"
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        mentions = [word[1:] for word in self.content.split() if word.startswith('@') and User.objects.filter(username=word[1:])]
        for mention in mentions: Mention.objects.get_or_create(
                username=User.objects.get(username=self.username), 
                mention=User.objects.get(username=mention),
                post=self.post)


class Mention(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentioned_by")
    mention = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mention")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)


class Tag(models.Model):
    tag = models.CharField(max_length=100)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.tag


class Like(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, blank=True, null=True)
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [
            ('username', 'post'),
            ('username', 'reply')
        ]

    def __str__(self):
        return f"{self.username} likes {self.post}"