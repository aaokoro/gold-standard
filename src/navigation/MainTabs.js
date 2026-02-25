import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../../theme';
import DashboardScreen from '../screens/pulse/DashboardScreen';
import AggieAIScreen from '../screens/pulse/AggieAIScreen';
import PlannerScreen from '../screens/pulse/PlannerScreen';
import TraditionsScreen from '../screens/pulse/TraditionsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.backgroundDark },
        headerTintColor: COLORS.aggieGold,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: COLORS.backgroundDark,
          borderTopColor: COLORS.borderDark,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.aggieGold,
        tabBarInactiveTintColor: COLORS.aggieBlue,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarActiveBackgroundColor: COLORS.surfaceDarkElevated,
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarItemStyle: { borderRadius: 12, marginHorizontal: 4, marginVertical: 6 },
        tabBarShowLabel: true,
        tabBarIcon: () => null,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="AggieAI"
        component={AggieAIScreen}
        options={{
          title: 'Ask Aggie',
          tabBarLabel: 'Aggie AI',
        }}
      />
      <Tab.Screen
        name="Planner"
        component={PlannerScreen}
        options={{
          title: 'Study Planner',
          tabBarLabel: 'Planner',
        }}
      />
      <Tab.Screen
        name="Traditions"
        component={TraditionsScreen}
        options={{
          title: 'Traditions',
          tabBarLabel: 'Traditions',
        }}
      />
    </Tab.Navigator>
  );
}
