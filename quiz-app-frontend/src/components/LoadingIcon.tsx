import { Image, Segment, Dimmer, Loader } from "semantic-ui-react";

export const LoadingIcon = () => {
        return (
      <Segment>
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
      </Segment>
    );
};
