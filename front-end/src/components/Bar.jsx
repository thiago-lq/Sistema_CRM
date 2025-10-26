import empresa from "../assets/icone_empresa.png";

export default function Bar(){
  return(
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between px-5 py-0 z-50">
      <div className="flex items-center space-x-3">
        <button className="flex items-center text-gray-700 hover:text-indigo-600 transition-all duration-300 p-2">
          <img src={empresa} alt="empresa" className="h-25 w-25" />
          <span className="text-3xl font-bold text-black">SEU CRM</span>
        </button>
      </div>
  </nav>
        );
}