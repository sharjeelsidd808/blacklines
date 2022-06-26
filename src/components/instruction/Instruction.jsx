import "./instruction.css";

export default function Instruction({ title, message }) {
  return (
    <div className="instruction">
      {title && <h1>{title}</h1>}
      {message && <p>{message}</p>}
    </div>
  );
}
