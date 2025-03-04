/* eslint-disable @typescript-eslint/no-explicit-any */
// components/address/SearchDropdown.tsx
import { Search, Loader2 } from "lucide-react";
import { Select } from "antd";

const { Option, OptGroup } = Select;

type SearchDropdownProps = {
  address: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setError: (error: string | null) => void;
  isSending: boolean;
  isButtonDisabled: boolean;
  onSendRequest: () => void;
  SEARCH_OPTIONS: any[]; // You might want to create a proper type for this
};

export function SearchDropdown({
  address,
  searchQuery,
  setSearchQuery,
  setError,
  isSending,
  isButtonDisabled,
  onSendRequest,
  SEARCH_OPTIONS,
}: SearchDropdownProps) {
  if (!address) return null;

  return (
    <div className="relative max-w-md mx-auto md:mx-0 animate-fadeInUp">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Select
          showSearch
          placeholder="What can we get you?"
          value={searchQuery || undefined}
          onChange={(value) => {
            setSearchQuery(value);
            setError(null);
          }}
          filterOption={(input, option) =>
            (option?.label?.toString().toLowerCase() ?? "").includes(
              input.toLowerCase()
            )
          }
          className="custom-ant-select w-full"
          dropdownStyle={{ borderRadius: "8px" }}
        >
          {SEARCH_OPTIONS.map((category) => (
            <OptGroup key={category.category} label={category.category}>
              {category.items.map((item: any) => (
                <Option key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Option>
              ))}
            </OptGroup>
          ))}
        </Select>
      </div>
      <button
        onClick={onSendRequest}
        disabled={isButtonDisabled}
        className="w-full mt-8 bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors disabled:opacity-70"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Request"
        )}
      </button>
    </div>
  );
}
