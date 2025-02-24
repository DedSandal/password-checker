import { useState } from "react";
import axios from "axios";

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [conditions, setConditions] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isMinLength8: false,
    isMinLength12: false,
    hasRepetitions: false,
    isCommonPassword: false,
  });

  const handleChange = async (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      try {
        const response = await axios.post("http://localhost:3000/check-password", {
          password: newPassword,
        });
        setStrength(response.data.strength);
        setConditions(response.data);
      } catch (error) {
        console.error("Error checking password strength", error);
      }
    } else {
      setStrength("");
      setConditions({
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        isMinLength8: false,
        isMinLength12: false,
        hasRepetitions: false,
        isCommonPassword: false,
      });
    }
  };

  const getProgressBarStyle = () => {
    switch (strength) {
      case "weak":
        return "bg-danger";
      case "medium":
        return "bg-warning";
      case "strong":
        return "bg-success";
      default:
        return "";
    }
  };

  const getProgressBarWidth = () => {
    switch (strength) {
      case "weak":
        return 25;
      case "medium":
        return 50;
      case "strong":
        return 100;
      default:
        return 0;
    }
  }

  const getStrengthName = () => {
    switch (strength) {
      case "weak":
        return "Слабкий";
      case "medium":
        return "Середній";
      case "strong":
        return "Сильний";
      default:
        return "";
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Перевірка безпечності паролів</h1>
      <div className="form-group">
        <label htmlFor="password">Пароль:</label>
        <input
          type="text"
          className="form-control mt-1"
          id="password"
          value={password}
          onChange={handleChange}
        />
        <div id="password-strength" className="progress mt-4">
          <div
            className={`progress-bar ${getProgressBarStyle()}`}
            role="progressbar"
            style={{ width: `${getProgressBarWidth()}%` }}
            aria-valuenow={getProgressBarWidth()}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {getStrengthName()}
          </div>
        </div>
        <div id="password-conditions" className="mt-2">
          <ul>
            <li className={conditions.hasLowercase ? "text-success" : "text-danger"}>Містить хоча б 1 маленьку літеру
            </li>
            <li className={conditions.hasUppercase ? "text-success" : "text-danger"}>Містить хоча б 1 велику літеру</li>
            <li className={conditions.hasNumber ? "text-success" : "text-danger"}>Містить хоча б 1 цифру</li>
            <li className={conditions.hasSpecialChar ? "text-success" : "text-danger"}>Містить хоча б 1 спеціальний
              символ
            </li>
            <li className={conditions.isMinLength8 ? "text-success" : "text-danger"}>Містить щонайменше 8 символів</li>
            <li className={conditions.isMinLength12 ? "text-success" : "text-danger"}>Містить щонайменше 12 символів
            </li>
            <li className={conditions.hasRepetitions ? "text-danger" : "text-success"}>Не містить повторюваних
              послідовностей
            </li>
            <li className={conditions.isCommonPassword ? "text-danger" : "text-success"}>Не є поширеним паролем</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
