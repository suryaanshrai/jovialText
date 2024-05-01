from django.contrib import admin

# Register your models here.
from .models import User, Posts, Like, Follower, Tag, UserPic, UserBio

admin.site.register(User)
admin.site.register(Posts)
admin.site.register(Like)
admin.site.register(Follower)
admin.site.register(Tag)
admin.site.register(UserBio)
admin.site.register(UserPic)

