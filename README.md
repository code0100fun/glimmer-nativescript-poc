# NativeScript Glimmer Proof of Concept

A simple proof-of-concept app to demonstrate Glimmer rendering to NativeScript views.

![Android demo. Navigating app menu.](https://media.giphy.com/media/dujOrODBet478JX7w5/giphy.gif)

## Setup

The NativeScript installation requires quite a few packages and tools to be installed and configured in specific ways. It would be too complicated to describe the details for even one OS and target platform (Android, iOS) so instead I'll just point to the [NativeScript docs](https://docs.nativescript.org/start/introduction) that do a very good job describing the specifics.

For the general Linux + Android development case the setup is roughly as follows:

### Android

Install Adroid Studio and install an Android SDK >= 22.

Create a virtual device emulator with SDK version >= 22.

Set the `$ANDROID_HOME` environment variable to your installed SDK location.

### NativeScript

Install NativeScript CLI globally:

```
$ npm install -g nativescript
```

Install [NativeScript Sidekick](https://docs.nativescript.org/sidekick/intro/installation).

Check that nativescript is detecting the correct Android setup:

```
$ tns doctor
✔ Getting environment information

No issues were detected.
✔ Your ANDROID_HOME environment variable is set and points to correct directory.
✔ Your adb from the Android SDK is correctly installed.
✔ The Android SDK is installed.
✔ A compatible Android SDK for compilation is found.
✔ Javac is installed and is configured properly.
✔ The Java Development Kit (JDK) is installed and is configured properly.
✔ Local builds for iOS can be executed only on a macOS system. To build for iOS on a different operating system, you can use the NativeScript cloud infrastructure.
✔ Getting NativeScript components versions information...
✔ Component nativescript has 5.0.2 version and is up to date.
```

If this all succeeds you should be good to clone and build the project.

## Build

Build the Glimmer assets with Ember CLI:

```
$ ember build
```

Copy the dist files into the `app/` directory to be copied by NativeScript to the device.

```
cp dist/app.js app/
cp dist/app.css app/
```

There is a script in `bin/build` that will do this so you can also just run:

```
$ ./bin/build
```

## Run

To run the project on an emulated Android device you need to first start the Android device with AVD Manager.

Then run the NativeScript command:

```
$ tns run android --emulator
```
