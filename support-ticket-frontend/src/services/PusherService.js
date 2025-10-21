import Pusher from "pusher-js";

Pusher.logToConsole = import.meta.env.NODE_ENV === "development";

class PusherService {
  constructor() {
    this.pusher = null;
    this.channels = new Map();
    this.connectionState = "disconnected";
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  initialize() {
    try {
      const token = localStorage.getItem("token");

      if (!import.meta.env.VITE_APP_PUSHER_KEY) {
        return null;
      }

      if (
        this.pusher &&
        ["connected", "connecting"].includes(this.connectionState)
      ) {
        return this.pusher;
      }

      if (this.pusher) {
        this.disconnect();
      }

      //   create pusher instance
      this.pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_KEY, {
        cluster: import.meta.env.VITE_APP_PUSHER_CLUSTER || "mt1",
        forceTLS: true,
        authEndpoint: `${
          import.meta.env.VITE_APP_API_URL
        }/api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
        enabledTransports: ["ws", "wss"],
      });

      //   all event listeners
      this.pusher.connection.bind("connected", () => {
        console.log("pusher connected...");
        this.connectionState = "connected";
        this.reconnectAttempts = 0;
      });

      this.pusher.connection.bind("connecting", () => {
        console.log("pusher connecting...");
        this.connectionState = "connecting";
      });

      this.pusher.connection.bind("disconnected", () => {
        console.log("pusher disconnected");
        this.connectionState = "disconnected";
      });

      this.pusher.connection.bind("error", (err) => {
        console.error("pusher connection error:", err);
        this.connectionState = "error";
      });

      this.pusher.connection.bind("state_change", (states) => {
        console.log("pusher state changed:", states);
        this.connectionState = states.current;
      });

      this.checkAuthentication();

      console.log("Pusher initialized successfully");
      return this.pusher;
    } catch (error) {
      console.error("Failed initialize:", error);
      this.connectionState = "error";
      return null;
    }
  }

  //check authentication
  checkAuthentication() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("not found in localStorage");
      return false;
    }
    if (token.split(".").length === 3) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.error("expired at:", new Date(payload.exp * 1000));
          return false;
        }

        console.log("Valid token:", payload);
        return true;
      } catch (error) {
        console.error("Token validation error:", error);
        return false;
      }
    }else{
        return true;
    }
  }

  //subscribe
  async subscribe(channelName) {
    if (!this.pusher || !this.isConnected()) {
      console.log("pusher not ready, initializing...");
      this.initialize();
    }

    if (!this.pusher) {
      console.error("initialization failed");
      return null;
    }

    if (this.channels.has(channelName)) {
      console.log(`Already subscribed to channel: ${channelName}`);
      return this.channels.get(channelName);
    }

    try {
      console.log(`subscribing to channel: ${channelName}`);
      const channel = this.pusher.subscribe(channelName);

      channel.bind("pusher:subscription_succeeded", () => {
        console.log(`Successfully subscribed to channel: ${channelName}`);
      });

      channel.bind("pusher:subscription_error", (error) => {
        console.error(`failed to subscribe to channel ${channelName}:`, error);
        this.channels.delete(channelName);
      });

      this.channels.set(channelName, channel);
      return channel;
    } catch (error) {
      console.error(`error subscribing to channel ${channelName}:`, error);
      return null;
    }
  }

  //unsubscribe
  unsubscribe(channelName) {
    if (this.channels.has(channelName)) {
      const channel = this.channels.get(channelName);
      try {
        channel.unbind_all();
        channel.unsubscribe();
        this.channels.delete(channelName);
        console.log(`unsubscribed from channel: ${channelName}`);
      } catch (error) {
        console.error(
          `error unsubscribing from channel ${channelName}:`,
          error
        );
      }
    }
  }

  //bind event
  async bindEvent(channelName, eventName, callback) {
    try {
      const channel = await this.subscribe(channelName);
      if (!channel) {
        console.error(
          `event - channel can not bind ${channelName} not available`
        );
        return () => {};
      }

      channel.bind(eventName, callback);

      return () => {
        console.log(
          `unbinding event: ${eventName} from channel: ${channelName}`
        );
        channel.unbind(eventName, callback);
      };
    } catch (error) {
      console.error(`error binding event ${eventName}:`, error);
      return () => {};
    }
  }

  //disconnect
  disconnect() {
    if (this.pusher) {
      try {
        this.channels.forEach((channel, name) => {
          try {
            channel.unbind_all();
            channel.unsubscribe();
          } catch (error) {
            console.error(`error unsubscribing from ${name}:`, error);
          }
        });

        this.channels.clear();
        this.pusher.disconnect();
        this.pusher = null;
        this.connectionState = "disconnected";

        console.log("pusher disconnect done");
      } catch (error) {
        console.log("error disconnecting pusher:", error);
      }
    }
  }

  //reconnect
  reconnect() {
    console.log("reconnect pusher...");
    this.disconnect();
    setTimeout(() => {
      this.initialize();
    }, 1000);
  }

  //get instance
  getPusherInstance() {
    if (!this.pusher || !this.isConnected()) {
      this.initialize();
    }
    return this.pusher;
  }

  isConnecting() {
    return this.connectionState === "connecting";
  }

  isConnected() {
    return this.pusher && this.connectionState === "connected";
  }

  getConnectionState() {
    return this.connectionState;
  }
}

const pusherService = new PusherService();

export default pusherService;
