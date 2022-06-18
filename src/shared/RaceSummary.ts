import type { AdvertisedStart } from "./AdvertisedStart";

export class RaceSummary {
  meeting_name: string = "";
  race_number: number = 0;
  advertised_start: AdvertisedStart = { seconds: 0 };
  category_id: string = "";
  countdownSeconds: number = 0;

  // assists with populating the countdownSeconds field on RaceSummary
  public updateCountdown(seconds: number) {
    const now = Math.floor(Date.now() / 1000);
    const countdown = seconds - now;
    this.countdownSeconds = countdown;
  }
}
