# NutriDust Android apps

Two independent Capacitor applications are maintained here:

- Customer: `com.nutridust.foods`
- Rider: `com.nutridust.rider`

Mobile builds use `.env.mobile`. It currently points to the PC's Wi-Fi address for physical-phone testing. Update that file whenever the PC address changes. Before release, replace it with the deployed HTTPS API and change `allowMixedContent` to `false` in both Capacitor configs. `localhost` inside an APK points to the phone, not the NutriDust server.

## Prerequisites

- Android Studio with Android SDK
- JDK 21 available to Android Studio/Gradle

## Build

Run `npm run mobile:sync`, then build each app with `npm run apk:customer` and `npm run apk:rider`.

Debug APK outputs:

- `mobile/customer/android/app/build/outputs/apk/debug/app-debug.apk`
- `mobile/rider/android/app/build/outputs/apk/debug/app-debug.apk`

For Play Store release, create signed Android App Bundles in Android Studio. Never commit signing keystores or passwords.
