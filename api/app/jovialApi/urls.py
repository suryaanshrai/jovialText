from django.urls import include, path
from django.contrib import admin

from rest_framework import routers

from jovialApi import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'like', views.LikeViewSet)
router.register(r'post', views.PostViewSet)
router.register(r'follow', views.FollowerViewSet)

admin.site.site_header = "The Jovial Admin Page"

urlpatterns = [
    path('', include(router.urls), name="api-root"),
]