// types/address.ts
export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  // types.ts
export interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PlaceResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface LocationDetails {
  street_number: string;
  route: string;
  sublocality: string;
  locality: string;
  localGovernment: string; // Added localGovernment
  administrative_area: string;
  country: string;
  formattedAddress: string;
}