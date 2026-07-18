import React from "react";
import { Input } from "antd";
import { Search } from "lucide-react";
import { SearchBarRoot } from "./ui.styles";

/**
 * @param {{ value?: string, onChange?: (v: string) => void, placeholder?: string, style?: React.CSSProperties }} props
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  style,
  ...rest
}) {
  return (
    <SearchBarRoot style={style}>
      <Input
        allowClear
        value={value}
        placeholder={placeholder}
        prefix={<Search size={16} color="#6B7280" />}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
    </SearchBarRoot>
  );
}
