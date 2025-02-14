from django.urls import include, path
from django.contrib import admin

from rest_framework import routers

from jovialApi import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'post', views.PostViewSet) 
router.register(r'like', views.LikeViewSet)
router.register(r'follow', views.FollowerViewSet)
router.register(r'positive_posts', views.PositivePostsViewset, basename='postivie-posts')

admin.site.site_header = "The Jovial Admin Page"

urlpatterns = [
    path('', include(router.urls), name="api-root"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/register/', include('dj_rest_auth.registration.urls')),
    path('auth/google/', views.GoogleLogin.as_view(), name='google_login'),
    path('accounts/', include('allauth.urls'), name='socialaccount_signup'),
]