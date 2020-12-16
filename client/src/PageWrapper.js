import './PageWrapper.css';

export default function PageWrapper({ children }) {
  return (
    <div className="PageWrapper">
      {children}
    </div>
  )
}