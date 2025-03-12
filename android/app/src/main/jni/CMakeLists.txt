cmake_minimum_required(VERSION 3.13)

# Define the library name here.
project(cvappmodules)

set(LIBS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../libs/)

# opencv
set(OpenCV_DIR ${LIBS_DIR}/OpenCV-android-sdk/sdk/native/jni)
find_package(OpenCV REQUIRED)

#onnxruntime
set(ONNXRUNTIME_DIR ${LIBS_DIR}/onnxruntime_android)
add_library(onnxruntime SHARED IMPORTED)
set_target_properties(
        onnxruntime
        PROPERTIES
        IMPORTED_LOCATION ${ONNXRUNTIME_DIR}/jni/${ANDROID_ABI}/libonnxruntime.so
        INTERFACE_INCLUDE_DIRECTORIES ${ONNXRUNTIME_DIR}/headers
)

# This file includes all the necessary to let you build your React Native application
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Define where the additional source code lives. We need to crawl back the jni, main, src, app, android folders
target_sources(${CMAKE_PROJECT_NAME} PRIVATE ../../../../../shared/NativeClassifyImageModule.cpp)

# Define where CMake can find the additional header files. We need to crawl back the jni, main, src, app, android folders
target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC ../../../../../shared PUBLIC ${OpenCV_INCLUDE_DIRS})
target_link_libraries(${CMAKE_PROJECT_NAME} ${OpenCV_LIBS} onnxruntime)