import Slider from "react-slick";
import './stylesheets/rules.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Rules(){

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return(
    <div className="rules">
      <Slider {...settings}>
        <div className="inRule">
          <h3>俳句を作ろう！</h3>
          <div className="rule-text">
            最大5人のリレー形式で<br/>
            名句を作成しましょう<br/>            
          </div>
        </div>
        <div className="inRule">
          <h3>お題を出す</h3>
          <div className="rule-text">
            ユニークなお題を決めて<br/>
            友達を信じましょう<br/>            
          </div>
        </div>
        <div className="inRule">
          <h3>文字を入力</h3>
          <div className="rule-text">
            一文字ずつ俳句を埋めて<br/>
            完成へと導きましょう<br/>            
          </div>
        </div>
        <div className="inRule">
          <h3>俳句を詠む</h3>
          <div className="rule-text">
            名句になることを祈りつつ<br/>
            俳句を鑑賞しましょう<br/>            
          </div>
        </div>
      </Slider>
    </div>
  );
}