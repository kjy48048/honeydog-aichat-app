import React, { useRef, useState } from 'react';
import { FlatList } from 'react-native';

const ReverseScroll = ({ data, onScrollEnd, keyExtractor, renderItem }) => {
    const [initialContentHeight, setInitialContentHeight] = useState(0);

    const onScrollChat = e => {
        // 스크롤이 맨 위에 도달했을 때
        if (e.nativeEvent.contentOffset.y === 0) {
            onScrollEnd(); // 추가 데이터 불러오기
        }
    };

    const onContentSizeChange = (contentWidth, contentHeight) => {
        if (initialContentHeight === 0) {
            setInitialContentHeight(contentHeight);
        } else {
            const scrollOffset = contentHeight - initialContentHeight;
            this.flatListRef.scrollToOffset({ offset: scrollOffset, animated: false });
            setInitialContentHeight(contentHeight);
        }
    };

    return (
        <FlatList
            onScroll={onScrollChat}
            data={data}
            ref={ref => { this.flatListRef = ref; }}
            onContentSizeChange={(w, h) => onContentSizeChange(w, h)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
        />
    );
};

export default ReverseScroll;
