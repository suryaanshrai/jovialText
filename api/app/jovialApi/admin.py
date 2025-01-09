from django.contrib import admin
from .models import MyUser, Post, Follower, Like
# Register your models here.
admin.site.register(MyUser)
admin.site.register(Post)
admin.site.register(Follower)
admin.site.register(Like)