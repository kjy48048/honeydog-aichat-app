/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Ionicons from 'react-native-vector-icons/dist/Ionicons';

    const MessageText = (focused, name) => {
        let iconName, iconSize;

        if(name==='홈') {
            iconName = focused ? 'home-sharp' : 'home-outline'
        } else if (name ==='채팅목록') {
            iconName = focused ? 'people-circle-sharp' : 'people-circle-outline'
        } else if (name === '설정') {
            iconName = focused ? 'settings-sharp' : 'settings-outline'
        }

        iconSize = 20;

        return (
        <Ionicons
            name={iconName}
            size={iconSize}
        />
        )
    }

export default MessageText;
