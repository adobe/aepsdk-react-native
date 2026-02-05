//
//  WidgetMessagingDemoBundle.swift
//  WidgetMessagingDemo
//
//  Created by Shwetansh Srivastava on 05/02/26.
//

import WidgetKit
import SwiftUI

@main
struct WidgetMessagingDemoBundle: WidgetBundle {
    var body: some Widget {
        WidgetMessagingDemo()
        WidgetMessagingDemoLiveActivity()
    }
}
