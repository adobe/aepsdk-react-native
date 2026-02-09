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

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import {NavigationProps} from '../types/props';

const {LiveActivityBridge} = NativeModules;

interface RunningActivity {
  activityId: string;
  pushToken: string;
  departureAirport: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  journeyProgress: number;
  state: string;
}

const PROGRESS_PRESETS = [0, 25, 50, 75, 100];

const ActivityCard = ({
  activity,
  index,
  onRefresh,
}: {
  activity: RunningActivity;
  index: number;
  onRefresh: () => void;
}) => {
  const [updating, setUpdating] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<number>(
    activity.journeyProgress,
  );

  const updateProgress = (progress: number) => {
    setUpdating(true);
    setSelectedProgress(progress);
    LiveActivityBridge.updateActivityProgress(activity.activityId, progress)
      .then(() => {
        onRefresh();
      })
      .catch((error: any) => {
        Alert.alert('Error', error.message || 'Failed to update');
        setSelectedProgress(activity.journeyProgress);
      })
      .finally(() => setUpdating(false));
  };

  return (
    <View style={styles.activityCard}>
      <Text style={styles.activityTitle}>Activity {index + 1}</Text>
      <Text style={styles.flightInfo}>
        {activity.departureAirport} → {activity.arrivalAirport}
      </Text>
      <Text style={styles.progressText}>
        Terminal: {activity.arrivalTerminal}
      </Text>
      <Text
        style={[
          styles.stateText,
          activity.state === 'active' ? styles.stateActive : styles.stateEnded,
        ]}>
        State: {activity.state}
      </Text>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {width: `${Math.min(selectedProgress, 100)}%`},
          ]}
        />
      </View>
      <Text style={styles.progressLabel}>
        Flight Progress: {selectedProgress}%
      </Text>

      {/* Update progress buttons */}
      {activity.state === 'active' && (
        <View style={styles.progressButtonRow}>
          {PROGRESS_PRESETS.map(p => (
            <TouchableOpacity
              key={p}
              style={[
                styles.progressButton,
                selectedProgress === p && styles.progressButtonActive,
              ]}
              disabled={updating}
              onPress={() => updateProgress(p)}>
              <Text
                style={[
                  styles.progressButtonText,
                  selectedProgress === p && styles.progressButtonTextActive,
                ]}>
                {p}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* End button */}
      {activity.state === 'active' && (
        <TouchableOpacity
          style={styles.endButton}
          onPress={() => {
            LiveActivityBridge.endActivity(activity.activityId, true)
              .then(() => {
                setTimeout(() => onRefresh(), 500);
              })
              .catch((error: any) => {
                Alert.alert('Error', error.message || 'Failed to end');
              });
          }}>
          <Text style={styles.endButtonText}>End Activity</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const LiveActivityView = ({navigation}: NavigationProps) => {
  const [liveActivityID, setLiveActivityID] = useState('');
  const [channelID, setChannelID] = useState('');
  const [departureAirport, setDepartureAirport] = useState('MIA');
  const [arrivalAirport, setArrivalAirport] = useState('SFO');
  const [arrivalTerminal, setArrivalTerminal] = useState('Terminal 2');
  const [runningActivities, setRunningActivities] = useState<RunningActivity[]>(
    [],
  );
  const [activitiesEnabled, setActivitiesEnabled] = useState(false);

  const refreshActivities = async () => {
    if (Platform.OS !== 'ios' || !LiveActivityBridge) return;
    try {
      const activities = await LiveActivityBridge.getRunningActivities();
      setRunningActivities(activities);
    } catch (error) {
      console.log('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (Platform.OS !== 'ios' || !LiveActivityBridge) {
        setActivitiesEnabled(false);
        return;
      }
      try {
        const enabled = await LiveActivityBridge.areActivitiesEnabled();
        setActivitiesEnabled(enabled);
      } catch (error) {
        console.log('Error checking activities enabled:', error);
        setActivitiesEnabled(false);
      }
      refreshActivities();
    };
    init();
  }, []);

  const startLiveActivity = async () => {
    if (!liveActivityID.trim()) {
      Alert.alert('Error', 'Please enter a Live Activity ID');
      return;
    }
    try {
      const result = await LiveActivityBridge.startAirplaneActivity(
        liveActivityID,
        departureAirport,
        arrivalAirport,
        arrivalTerminal,
      );
      Alert.alert('Success', `Activity started with ID: ${result.activityId}`);
      setLiveActivityID('');
      refreshActivities();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start activity');
    }
  };

  const startChannelActivity = async () => {
    if (!channelID.trim()) {
      Alert.alert('Error', 'Please enter a Channel ID');
      return;
    }
    try {
      const result = await LiveActivityBridge.startAirplaneActivityWithChannel(
        channelID,
        departureAirport,
        arrivalAirport,
        arrivalTerminal,
      );
      Alert.alert(
        'Success',
        `Activity started with Channel: ${result.channelId}`,
      );
      setChannelID('');
      refreshActivities();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start activity');
    }
  };

  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Live Activities are only available on iOS
        </Text>
        <Button onPress={() => navigation.goBack()} title="Go Back" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">
      <Button onPress={() => navigation.goBack()} title="Go to main page" />

      <Text style={styles.title}>Live Activities</Text>

      {!activitiesEnabled && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Live Activities are disabled on this device. Enable them in Settings
            {'>'} Your App {'>'} Live Activities.
          </Text>
        </View>
      )}

      {/* Start Activity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Start Live Activity</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Departure</Text>
            <TextInput
              style={styles.input}
              value={departureAirport}
              onChangeText={setDepartureAirport}
              placeholder="MIA"
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Arrival</Text>
            <TextInput
              style={styles.input}
              value={arrivalAirport}
              onChangeText={setArrivalAirport}
              placeholder="SFO"
            />
          </View>
        </View>

        <Text style={styles.label}>Arrival Terminal</Text>
        <TextInput
          style={styles.input}
          value={arrivalTerminal}
          onChangeText={setArrivalTerminal}
          placeholder="Terminal 2"
        />

        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>Local (iOS 16.1+)</Text>
          <Text style={styles.description}>
            Start an Airplane Tracking Live Activity locally. A push token will
            be generated for remote updates.
          </Text>
          <TextInput
            style={styles.input}
            value={liveActivityID}
            onChangeText={setLiveActivityID}
            placeholder="Enter Live Activity ID"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={startLiveActivity}
            disabled={!activitiesEnabled}>
            <Text style={styles.buttonText}>Start Live Activity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>Using Channel (iOS 18+)</Text>
          <Text style={styles.description}>
            Start a Live Activity using a channel for broadcast updates.
          </Text>
          <TextInput
            style={styles.input}
            value={channelID}
            onChangeText={setChannelID}
            placeholder="Enter Channel ID"
          />
          <TouchableOpacity
            style={[styles.button, styles.channelButton]}
            onPress={startChannelActivity}
            disabled={!activitiesEnabled}>
            <Text style={styles.buttonText}>Subscribe and Start Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Running Activities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Running Activities</Text>
          <TouchableOpacity onPress={refreshActivities}>
            <Text style={styles.refreshButton}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {runningActivities.length === 0 ? (
          <Text style={styles.emptyText}>No live activities in progress</Text>
        ) : (
          <>
            {runningActivities.map((activity, index) => (
              <ActivityCard
                key={activity.activityId}
                activity={activity}
                index={index}
                onRefresh={refreshActivities}
              />
            ))}
            {runningActivities.length >= 1 && (
              <TouchableOpacity
                style={styles.endAllButton}
                onPress={() => {
                  LiveActivityBridge.endAllActivities()
                    .then(() => {
                      setTimeout(() => refreshActivities(), 500);
                    })
                    .catch((error: any) => {
                      Alert.alert(
                        'Error',
                        error.message || 'Failed to end activities',
                      );
                    });
                }}>
                <Text style={styles.endButtonText}>End All Activities</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  subsection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  channelButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  refreshButton: {
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  activityCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  flightInfo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  stateActive: {
    color: '#34C759',
  },
  stateEnded: {
    color: '#FF9500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  progressButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  progressButtonActive: {
    backgroundColor: '#007AFF',
  },
  progressButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  progressButtonTextActive: {
    color: '#FFFFFF',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  endAllButton: {
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default LiveActivityView;
