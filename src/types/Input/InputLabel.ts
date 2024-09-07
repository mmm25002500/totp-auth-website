export interface InputLabelProps {
  value: string;
  isRequired: boolean;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}