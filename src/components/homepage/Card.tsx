import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CardProps {
  title: string;
  description: string;
  icon: IconDefinition;
  buttonText?: string;
  buttonLink?: string;
}

const HomePageCard = (props: CardProps) => {
  return (
    <div className="card w-96 shadow-xl text-black dark:text-white bg-white dark:bg-base-100 justify-self-center">
      <figure className="px-10 pt-10">
        <FontAwesomeIcon icon={props.icon} className="rounded-xl w-1/4 pr-1" />
        {/* <img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="No Img" className="rounded-xl" /> */}
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{ props.title }</h2>
        <p>{props.description}</p>
        {
          props.buttonLink || props.buttonText ? (
            <div className="card-actions">
              <button className="btn btn-primary">{ props.buttonText }</button>
            </div>
          ) : ''
          }
      </div>
    </div>
  )
}

export default HomePageCard;