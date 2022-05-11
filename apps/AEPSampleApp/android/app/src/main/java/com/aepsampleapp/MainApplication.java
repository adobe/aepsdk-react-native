/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

package com.aepsampleapp;

import android.app.Application;
import android.content.Context;
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.Messaging;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.Signal;
import com.adobe.marketing.mobile.UserProfile;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Assurance;
import com.adobe.marketing.mobile.edge.identity.Identity;
import com.adobe.marketing.mobile.edge.consent.Consent;
import com.adobe.marketing.mobile.optimize.Optimize;
import com.adobe.marketing.mobile.InvalidInitException;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    MobileCore.setApplication(this);
    MobileCore.setLogLevel(LoggingMode.VERBOSE);
    try {
        Edge.registerExtension();
        Identity.registerExtension();
        Optimize.registerExtension();
        Messaging.registerExtension();
        UserProfile.registerExtension();
        Lifecycle.registerExtension();
        Signal.registerExtension();
        Consent.registerExtension();
        Assurance.registerExtension();
    } catch (InvalidInitException e) {
        e.printStackTrace();
    }
    MobileCore.configureWithAppID("YOUR-APP-ID");
    MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
            MobileCore.lifecycleStart(null);
        }
    });
  }
}
