"use client";

import PhoneInput from "react-phone-input-2";

interface Props {
  phoneNo: string;
  onFocus?: () => void;
  setPhoneNo: (value: React.SetStateAction<string>) => void;
}

export default function PhoneNumberInput({
  phoneNo,
  onFocus,
  setPhoneNo,
}: Props) {
  return (
    <PhoneInput
      country="ng"
      countryCodeEditable={false}
      value={phoneNo || ""} // Ensure value is always a string
      onChange={setPhoneNo}
      buttonClass="h-full w-fit"
      enableSearch
      onFocus={onFocus}
      inputStyle={{
        width: "100%",
        height: "38px",
        borderRadius: "8px",
        color: "#000",
        border: "1px solid #D0D5DD",
        fontWeight: "500",
      }}
      buttonStyle={{
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        border: "1px solid #D0D5DD",
      }}
      containerStyle={{
        borderRadius: "8px",
      }}
    />
  );
}
