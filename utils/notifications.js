import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function scheduleLectureNotification(lecture) {
  const trigger = new Date();
  const [hour, minute] = lecture.time.split(':');
  const dayIndex = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(lecture.day);
  trigger.setHours(hour);
  trigger.setMinutes(minute - 10); // 10 mins early
  trigger.setSeconds(0);

  while (trigger.getDay() !== dayIndex) {
    trigger.setDate(trigger.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Upcoming Lecture: ${lecture.course}`,
      body: `Location: ${lecture.location}`,
    },
    trigger,
  });
}
