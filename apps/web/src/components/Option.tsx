import React from "react";
import { SelectOption, SelectOptionGroup } from "./Select";

type Props = {
  option: SelectOptionGroup | SelectOption;
};

const Option: React.FC<Props> = ({ option }) => {
  const optionIsGroup = (
    option: SelectOption | SelectOptionGroup
  ): option is SelectOptionGroup => {
    return (option as SelectOptionGroup).options !== undefined;
  };

  if (optionIsGroup(option)) {
    return (
      <optgroup label={option.label}>
        {option.options.map((option, index) => (
          <option value={option.value} key={index}>
            {option.label}
          </option>
        ))}
      </optgroup>
    );
  }

  return <option value={option.value}>{option.label}</option>;
};

export default Option;
