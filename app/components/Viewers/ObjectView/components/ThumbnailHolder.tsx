
import styles from './ThumbnailHolder.module.scss';

interface Props {
  imageLink: string;
}

export const ThumbnailHolder = ({ imageLink }: Props) => {
  return (
    <>
      { /*  TODO  should I use another image components e.g. Image, etc...? */ }
      <a href={ imageLink } target="_blank">
        <img className={ styles['img'] } src={ imageLink }/>
      </a>
    </>
  );
};

