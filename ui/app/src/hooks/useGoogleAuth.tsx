import conf from "@/conf/conf";
import useResponseHandler from "./useResponseHandler";

export default function useGoogleAuth( code: string = "") {
    if (code === "") window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:5173/&prompt=consent&response_type=code&client_id=4683390329-dtki8jkel6or719qi6fk7qrnp8dvnven.apps.googleusercontent.com&scope=openid%20email%20profile&access_type=offline"
    else {
        fetch(`${conf.api_url}auth/google/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({code})
        })
        .then(response => useResponseHandler(response))
        .then(data => {
            if (data.invalid) return;
            localStorage.setItem("jovialUser", `${conf.api_url}user/${data.user.pk}`)
            localStorage.setItem("jovialAuthToken", data.access)
            localStorage.setItem("jovialRefreshToken", data.refresh)
            window.location.href = "/"
        })
    }
}