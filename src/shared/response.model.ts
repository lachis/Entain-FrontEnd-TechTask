export interface RaceSummary {
  meeting_name: string;
  race_number: number;
  advertised_start: AdvertisedStart;
  category_id: string;
  countdownSeconds: number;
}

export interface ResponseModel {
  [index: string]: RaceSummary[];
}

export interface DropdownOption {
  id: string;
  name: string;
}

export interface AdvertisedStart {
  seconds: number;
}
