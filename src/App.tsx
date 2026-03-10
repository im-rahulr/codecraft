import React from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PhotoGrid from "./components/PhotoGrid";
import UploadPage from "./components/UploadPage";

function normalizePathname(pathname: string) {
  return pathname === "/upload" ? "/upload" : "/";
}

export default function App() {
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [currentPath, setCurrentPath] = React.useState(() =>
    normalizePathname(window.location.pathname),
  );

  React.useEffect(() => {
    document.title =
      currentPath === "/upload" ? "love-re Files - Upload" : "love-re Files";
  }, [currentPath]);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePathname(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = React.useCallback((path: string) => {
    const nextPath = normalizePathname(path);

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }

    setCurrentPath(nextPath);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header currentPath={currentPath} onNavigate={navigate} />

      {currentPath === "/upload" ? (
        <UploadPage
          onBackHome={() => navigate("/")}
          onUploadComplete={() => setRefreshToken((value) => value + 1)}
        />
      ) : (
        <>
          <SearchBar />
          <PhotoGrid refreshToken={refreshToken} />
        </>
      )}
    </div>
  );
}
