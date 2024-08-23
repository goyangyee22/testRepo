import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [position, setPosition] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    // 위치 정보를 가져오는 함수
    const fetchLocation = () => {
      if (navigator.geolocation) {
        //  navigator.geolocation.getCurrentPosition(
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setPosition({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError("사용자가 위치 권한을 거부했습니다.");
                break;
              case error.POSITION_UNAVAILABLE:
                setError("위치 정보를 사용할 수 없습니다.");
                break;
              case error.TIMEOUT:
                setError("위치 정보 요청 시간이 초과되었습니다.");
                break;
              case error.UNKNOWN_ERROR:
                setError("알 수 없는 오류가 발생했습니다.");
                break;
              default:
                setError("알 수 없는 오류가 발생했습니다.");
                break;
            }
          }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        setError("Geolocation API를 지원하지 않는 브라우저입니다.");
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="App">
      <h1>DW 아카데미 갤러리</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {position.lat && position.lon ? (
        <div>
          {/* <p>위도: {position.lat}</p> */}
          {/* <p>경도: {position.lon}</p> */}
          <p>
            작성자: ㅇㅇ({position.lat.toFixed(0)}.{position.lon.toFixed(0)})
          </p>
        </div>
      ) : (
        <p>위치 정보를 가져오는 중...</p>
      )}
    </div>
  );
}

export default App;
