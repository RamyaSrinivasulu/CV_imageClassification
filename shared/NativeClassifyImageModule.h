#pragma once

#include <AppSpecsJSI.h>

#include <memory>
#include <string>
#include <iostream>
#include <vector>
// opencv
#include <opencv2/opencv.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>
// onnxruntime
#include <onnxruntime_cxx_api.h>

namespace facebook::react {

class NativeClassifyImageModule : public NativeClassifyImageModuleCxxSpec<NativeInferenceModule> {
public:
  NativeClassifyImageModule(std::shared_ptr<CallInvoker> jsInvoker);

  // Function to load the model
  std::string loadModel(jsi::Runtime& rt, std::string modelPath, std::string labelPath);
  // Function to run inference
  std::string runInference(jsi::Runtime& rt, std::string imagePath);

private:
  std::vector<std::string> classes{};
  std::unique_ptr<Ort::Session> session= nullptr;
  std::unique_ptr < Ort::Env> env = nullptr;
};

} // namespace facebook::react