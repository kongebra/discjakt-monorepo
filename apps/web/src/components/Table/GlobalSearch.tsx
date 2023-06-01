import React from "react";
import Input from "../Input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  show?: boolean;
};

const GlobalSearch: React.FC<Props> = ({ value, onChange, show }) => {
  if (show === false) {
    return null;
  }

  return (
    <div className="flex items-center justify-end mb-4">
      <Input
        className="max-w-sx"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="Søk..."
      />
    </div>
  );
};

export default GlobalSearch;
