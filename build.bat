@echo off
subst W: C:\Users\Administrateur\.gemini\antigravity\scratch\wet-my-plants
if errorlevel 1 (
    echo Subst failed or W: already exists.
) else (
    echo Subst success.
)
W:
cd android
call gradlew.bat app:assembleDebug -x lint -x test --configure-on-demand --build-cache -PreactNativeDevServerPort=8081 -PreactNativeArchitectures=x86_64,arm64-v8a
set BUILD_STATUS=%ERRORLEVEL%
C:
cd C:\Users\Administrateur\.gemini\antigravity\scratch\wet-my-plants
subst W: /d
exit /b %BUILD_STATUS%
