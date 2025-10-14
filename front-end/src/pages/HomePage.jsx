import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <div className="mt-100">
              <Modal/>
              <NavBar/>
      </div>
    </div>
  );
}
