// reusable M-pesa phone input with fixed +254 prefix
const PhoneInput = ({ value, onChange, disabled }) => {
    return (

    <div className="phone-input-wrapper">
      <span className="phone-input-prefix">+254</span>
 
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="705 273 739"
        maxLength={9}
        className="phone-input-field"
      />
 
    </div>
  );
};

export default PhoneInput;