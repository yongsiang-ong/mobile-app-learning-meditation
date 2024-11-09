import { View, Text, ImageBackground, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import meditationImages from "@/constants/meditation-images";
import AppGradient from "@/components/AppGradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "@/components/CustomButton";
import { AUDIO_FILES, MEDITATION_DATA } from "@/constants/meditation-data";
import { TimerContext } from "@/context/TimerContext";

// TODO: REFACTOR to a utils file
const convertSecondsToTime = (timeInSeconds: number): string => {
  const hour = Math.floor(timeInSeconds / 3600);
  const min = Math.floor((timeInSeconds - hour * 3600) / 60);
  const second = timeInSeconds - hour * 3600 - min * 60;
  return `${hour.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
};

const Meditate = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { duration, setDuration } = useContext(TimerContext);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [audioSound, setAudioSound] = useState<Audio.Sound>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    resetSound();
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsMeditating(false);
      resetSound();
      return;
    }
    let timer: NodeJS.Timeout;
    if (isMeditating) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [timeRemaining, isMeditating]);

  useEffect(() => {
    return () => {
      audioSound?.unloadAsync();
    };
  }, [audioSound]);

  const toggleMeditationSessionStatus = async () => {
    if (timeRemaining === 0) {
      setTimeRemaining(duration);
    }
    setIsMeditating(!isMeditating);
    await toggleSound();
  };

  const toggleSound = async () => {
    const sound = audioSound ? audioSound : await initializeSound();
    const status = await sound?.getStatusAsync();
    if (status?.isLoaded && !isAudioPlaying) {
      await sound.playAsync();
      setIsAudioPlaying(true);
    } else {
      await sound.pauseAsync();
      setIsAudioPlaying(false);
    }
  };

  const resetSound = async () => {
    if (!audioSound) await initializeSound();
    await audioSound?.stopAsync();
    setIsAudioPlaying(false);
  };

  const initializeSound = async () => {
    const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;
    const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName]);
    setAudioSound(sound);
    return sound;
  };

  const handleAdjustDuration = () => {
    if (isMeditating) {
      toggleMeditationSessionStatus();
    }
    router.push("/(modal)/adjust-meditation-duration");
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={meditationImages[Number(id) - 1]}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10"
          >
            <AntDesign name="leftcircleo" size={32} color="white" />
          </Pressable>
          <View className="flex-1 justify-center">
            <View className="mx-auto bg-neutral-200 rounded-full w-52 h-52 justify-center items-center opacity-75">
              <Text className="text-4xl text-blue-800 font-rmono">
                {convertSecondsToTime(timeRemaining)}
              </Text>
            </View>
          </View>
          <View className="mb-5">
            <CustomButton
              title={`Adjust Duration`}
              onPress={handleAdjustDuration}
              containerStyles="mb-4"
            />
            <CustomButton
              title={`${isMeditating ? "Stop" : "Start"} Meditation`}
              onPress={toggleMeditationSessionStatus}
            />
          </View>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default Meditate;
