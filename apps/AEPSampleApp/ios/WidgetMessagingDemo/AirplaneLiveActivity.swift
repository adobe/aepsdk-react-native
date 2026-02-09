/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import WidgetKit
import ActivityKit
import SwiftUI
import AEPMessagingLiveActivity

// MARK: - AirplaneLiveActivity

struct AirplaneLiveActivity: Widget {
    // Hard-coded flight info for demo
    let flightNumber = "HZ1234"
    let airlineName = "Adobe Air"
    let scheduledDepartureTime = "11:02 AM"
    let scheduledArrivalTime = "4:55 PM"
    
    // We'll now mock total travel time as 5 hours (300 minutes),
    // and dynamically compute what's left based on the journeyProgress.
    
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: AirplaneTrackingAttributes.self) { context in
            AirplaneTrackingLiveActivityView(
                context: context,
                flightNumber: flightNumber,
                airlineName: airlineName,
                departureAirportCode: context.attributes.departureAirport,
                arrivalAirportCode: context.attributes.arrivalAirport,
                scheduledDepartureTime: scheduledDepartureTime,
                scheduledArrivalTime: scheduledArrivalTime
            )
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Text(context.attributes.departureAirport)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.attributes.arrivalAirport)
                }
                DynamicIslandExpandedRegion(.center) {
                    Text("Flight #\(flightNumber)")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Progress: \(context.state.journeyProgress)%")
                }
            } compactLeading: {
                Text(context.attributes.departureAirport)
            } compactTrailing: {
                Text(context.attributes.arrivalAirport)
            } minimal: {
                Image(systemName: "airplane")
            }
        }
    }
}

// MARK: - Lock Screen / Banner View

struct AirplaneTrackingLiveActivityView: View {
    let context: ActivityViewContext<AirplaneTrackingAttributes>
    
    let flightNumber: String
    let airlineName: String
    let departureAirportCode: String
    let arrivalAirportCode: String
    let scheduledDepartureTime: String
    let scheduledArrivalTime: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            
            // --- Top Row: Airline name & "Time remaining" or "Landed"
            HStack {
                Image(systemName: "globe")
                    .resizable()
                    .frame(width: 20, height: 20)
                    .foregroundColor(.white)
                
                Text(airlineName)
                    .font(.headline)
                
                Spacer()
                
                Text(remainingTimeString(for: context.state.journeyProgress))
                    .font(.headline)
            }
            
            // --- Middle Row: SFO [arc] IAH
            HStack {
                Text(departureAirportCode)
                    .font(.title)
                    .fontWeight(.semibold)
                
                GeometryReader { geo in
                    ZStack {
                        let fraction = CGFloat(context.state.journeyProgress) / 100.0
                        let w = geo.size.width
                        let h = geo.size.height
                        
                        // Define arc endpoints & control
                        let circleRadius: CGFloat = 12
                        let p0 = CGPoint(x: circleRadius,   y: h/2)
                        let p2 = CGPoint(x: w - circleRadius, y: h/2)
                        let arcHeight = h
                        let c  = CGPoint(
                            x: (p0.x + p2.x) / 2,
                            y: (h/2) - arcHeight
                        )
                        
                        // 1) The full dotted arc (for reference)
                        QuadArcShape(start: p0, control: c, end: p2)
                            .trim(from: 0, to: 1)
                            .stroke(
                                Color.white.opacity(0.4),
                                style: StrokeStyle(lineWidth: 2, dash: [4,4])
                            )
                        
                        // 2) The partial solid arc (0..fraction)
                        if fraction > 0 {
                            QuadArcShape(start: p0, control: c, end: p2)
                                .trim(from: 0, to: fraction)
                                .stroke(
                                    Color.white,
                                    style: StrokeStyle(lineWidth: 3, lineCap: .round)
                                )
                        }
                        
                        // 3) Endpoints
                        ArcEndpointView()
                            .position(x: p0.x, y: p0.y)
                        ArcEndpointView()
                            .position(x: p2.x, y: p2.y)
                        
                        // 4) Plane icon on the arc
                        let planePoint = pointOnQuadArc(t: fraction, p0: p0, c: c, p2: p2)
                        Image(systemName: "airplane")
                            .font(.title2)
                            .position(planePoint)
                    }
                }
                .frame(height: 40)
                
                Text(arrivalAirportCode)
                    .font(.title)
                    .fontWeight(.semibold)
            }
            
            // --- Bottom Row
            HStack {
                Text("Departed \(scheduledDepartureTime)")
                    .font(.subheadline)
                
                Spacer()
                
                Text("\(context.attributes.arrivalTerminal) \(scheduledArrivalTime)")
                    .font(.subheadline)
            }
        }
        .padding()
        .foregroundColor(.white)
        // Background color changes to green once journey completes
        .background(context.state.journeyProgress < 100 ? Color.blue : Color.green)
        .cornerRadius(12)
    }
    
    /// Returns a string representation of the remaining time or "Landed",
    /// based on the journeyProgress.
    private func remainingTimeString(for progress: Int) -> String {
        let fraction = Double(progress) / 100.0
        
        // If fully complete, show "Landed"
        if fraction >= 1.0 {
            return "Landed"
        }
        // If exactly 0% done, show 5h
        if fraction == 0.0 {
            return "5h Remaining"
        }
        // If >= 99%, show "~2m"
        if fraction >= 0.99 {
            return "~2m Remaining"
        }
        
        // Otherwise, scale linearly from 5h (300 minutes) down to 0
        let totalMinutes = 300.0  // 5h
        let timeRemaining = totalMinutes * (1 - fraction)
        
        // Convert to hours/minutes as needed
        let intRemaining = Int(timeRemaining.rounded())
        
        if intRemaining >= 60 {
            // Hours/minute breakdown
            let hours = intRemaining / 60
            let minutes = intRemaining % 60
            if minutes == 0 {
                return "\(hours)h Remaining"
            } else {
                return "\(hours)h \(minutes)m Remaining"
            }
        } else {
            // < 60 minutes
            return "\(intRemaining)m Remaining"
        }
    }
}

// MARK: - QuadArcShape

/// A shape that draws a single quadratic arc
struct QuadArcShape: Shape {
    let start: CGPoint
    let control: CGPoint
    let end: CGPoint
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: start)
        path.addQuadCurve(to: end, control: control)
        return path
    }
}

// MARK: - pointOnQuadArc

/// Return the XY point for t in [0..1].
private func pointOnQuadArc(t: CGFloat,
                            p0: CGPoint,
                            c: CGPoint,
                            p2: CGPoint) -> CGPoint {
    let u = 1 - t
    let x = u*u*p0.x + 2*u*t*c.x + t*t*p2.x
    let y = u*u*p0.y + 2*u*t*c.y + t*t*p2.y
    return CGPoint(x: x, y: y)
}

// MARK: - ArcEndpointView

struct ArcEndpointView: View {
    var body: some View {
        ZStack {
            Circle()
                .fill(Color.white.opacity(0.2))
                .frame(width: 24, height: 24)
            Circle()
                .fill(Color.white)
                .frame(width: 10, height: 10)
        }
    }
}

// MARK: - Preview States

extension AirplaneTrackingAttributes.ContentState {
    static let zero   = Self(journeyProgress: 0)
    static let twenty = Self(journeyProgress: 20)
    static let half   = Self(journeyProgress: 50)
    static let eighty = Self(journeyProgress: 80)
    static let full   = Self(journeyProgress: 100)
    static let nearFull = Self(journeyProgress: 99)  // For testing ~2m
}

// MARK: - Preview

#Preview("Notification", as: .content,
         using: AirplaneTrackingAttributes(liveActivityData: LiveActivityData(liveActivityID: "<FLIGHT_ID>"),
                                           arrivalAirport: "MIA",
                                           departureAirport: "SFO",
                                           arrivalTerminal: "Terminal C")
) {
    AirplaneLiveActivity()
} contentStates: {
    AirplaneTrackingAttributes.ContentState.zero
    AirplaneTrackingAttributes.ContentState.twenty
    AirplaneTrackingAttributes.ContentState.half
    AirplaneTrackingAttributes.ContentState.eighty
    AirplaneTrackingAttributes.ContentState.nearFull
    AirplaneTrackingAttributes.ContentState.full
}
