
import React from 'react';
import {
  CameraRoll,
  View,
  FlatList,
  StyleSheet,
  InteractionManager,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

const NUM_COLUMNS = 3;
const PAGE_SIZE = NUM_COLUMNS * 10;

const getImages = async params => {
  return await new Promise((res, rej) =>
    CameraRoll.getPhotos(params)
      .then(data => {
        const assets = data.edges;
        const images = assets.map(asset => asset.node.image);
        const page_info = data.page_info;
        res({ images, page_info });
      })
      .catch(rej)
  );
};

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Gallery />
      </View>
    );
  }
}

class Gallery extends React.Component {
  state = {
    permission: null, 
    images: null,
  };
  
  getMoreImages = () => {
    InteractionManager.runAfterInteractions(async () => {
      const { end_cursor, has_next_page, images } = this.state;

      if (!has_next_page && images) {
        return;
      }

      const { images: newImages, page_info: pageInfo } = await getImages({
        first: PAGE_SIZE,
        after: end_cursor,
      });

      this.setState({
        images: (images || []).concat(newImages),
        end_cursor: pageInfo.end_cursor,
        has_next_page: pageInfo.has_next_page,
      });
    });
  };

  render = () => (
    <List
      images={this.state.images}
      onSelectImage={image => {
        console.warn('Go to photo thing', image);
      }}
      onEndReached={this.getMoreImages}
      hasMore={this.state.has_next_page}
    />
  );
}

const List = ({ hasMore, images, onSelectImage, onEndReached }) => (
  <FlatList
    data={images || []}
    renderItem={({ item, index }) => (
      <Item uri={item.uri} onPress={() => onSelectImage(item, index)} />
    )}
    ListFooterComponent={<LoadingFooter hasMore={hasMore} animating={false} />}
    keyExtractor={item => item.uri}
    numColumns={NUM_COLUMNS}
    onEndReachedThreshold={0.5}
    onEndReached={onEndReached}
  />
);

const Item = ({ uri, onPress }) => (
  <TouchableOpacity style={styles.touchable} onPress={onPress}>
    <Image style={styles.image} source={{ uri }} />
  </TouchableOpacity>
);

const LoadingFooter = ({ hasMore }) => (
  <View style={styles.footerContainer}>
    {hasMore && <ActivityIndicator />}
    <Text style={styles.footerText}>
      {hasMore ? 'Loading more photos...' : "That's all!"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
  },
  touchable: {
    flex: 1,
    aspectRatio: 1,
  },
  image: {
    flex: 1,
    margin: 1,
    backgroundColor: '#ddd',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  footerText: {
    opacity: 0.7,
    marginLeft: 8,
  },
});
