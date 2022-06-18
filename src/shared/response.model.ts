
export interface RaceSummary {
  meeting_name: string;
  race_number: number;
  advertised_start: AdvertisedStart;
  category_id: string;
}

export interface ResponseModel2 {
  [index: string]: RaceSummary[];
}

export interface ResponseModel {
  [index: string]: RaceSummary;
}



export interface AdvertisedStart {
  seconds: number;
}