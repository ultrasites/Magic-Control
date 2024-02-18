import * as mqtt from "mqtt/dist/mqtt.min";
import { Subject, distinctUntilChanged, filter, map, tap } from "rxjs";

export interface MqttMessage {
  topic: string;
  message: string;
}

export class MQTT {
  private client: mqtt.MqttClient;
  private messages = new Subject<MqttMessage>();
  subscribedTopics: string[] = [];

  messages$ = this.messages.asObservable();

  constructor() {
    this.client = mqtt.connect({
      hostname: "192.168.178.158",
      port: 1884,
      protocol: "ws",
      clientId: "mmio"
    });

    this.client.on("connect", (err) => {
      console.error(err);
    });

    this.client.on("message", (topic, message) => {
      this.messages.next({ topic, message: message.toString() });
    });
  }

  subscribe(topic: string) {
    this.client.subscribe(topic);
    this.subscribedTopics.push(topic);
  }

  unsubcribe(topic: string) {
    this.client.unsubscribe(topic);
    delete this.subscribedTopics[this.subscribedTopics.indexOf(topic)];
  }

  observe<T>(oTopic: string) {
    return this.messages$.pipe(
      filter(({ topic, message }) => topic === oTopic && message !== "NaN"),
      distinctUntilChanged((prev, cur) => prev.message === cur.message),
      tap(console.log),
      map(({ message }) => (message ? JSON.parse(message) : message) as T)
    );
  }
}
