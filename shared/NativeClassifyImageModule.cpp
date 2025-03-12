#include "NativeInferenceModule.h"

namespace facebook::react {

NativeInferenceModule::NativeClassifyImageModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeClassifyImageModuleCxxSpec(std::move(jsInvoker)) {}

std::string NativeClassifyImageModule::loadModel(jsi::Runtime& rt, std::string modelPath, std::string labelPath){
    // Load the model file
    try{
        Ort::SessionOptions session_options{nullptr};
        auto envLocal = std::make_unique<Ort::Env>(ORT_LOGGING_LEVEL_WARNING, "Inference");
        env = std::move(envLocal);
        auto sessionLocal = std::make_unique<Ort::Session>(*env, model_path.c_str(), session_options);
        session = std::move(sessionLocal);
    }catch (const std::exception& e) {
        return std::string("false");
    }

    // Load the label file
    try{
        std::ifstream inputFile(labelPath);
        if (inputFile.is_open())
        {
            std::string classLine;
            while (std::getline(inputFile, classLine)){
                classes.push_back(classLine);
            }
            inputFile.close();
        }
    }catch (const std::exception& e) {
        return std::string("false");
    }

    // Both model file and label files are loaded successfully
    return std::string("true");

}

std::string NativeClassifyImageModule::runInference(jsi::Runtime& rt, std::string imagePath) {

    // Convert imageurl to file path
    const std::string prefix = "file://";
    if (imagePath.rfind(prefix, 0) == 0) { // Check if the URL starts with "file://"
        imagePath = imagePath.substr(prefix.length()); // Remove the prefix
    }
    // Load image
    cv::Mat img = cv::imread(image_path, cv::IMREAD_COLOR);

    // Get input and output names
    Ort::AllocatorWithDefaultOptions allocator;
    const char* input_name = session.GetInputName(0, allocator);
    const char* output_name = session.GetOutputName(0, allocator);
    // Get input tensor shape
    Ort::TypeInfo input_type_info = session.GetInputTypeInfo(0);
    auto input_tensor_info = input_type_info.GetTensorTypeAndShapeInfo();
    std::vector<int64_t> input_dims = input_tensor_info.GetShape();
    // Get input tensor dims
    const int input_width = input_dims[2];
    const int input_height = input_dims[3];
    const int input_channels = input_dims[1];
    // Preprocess the image
    cv::Mat resized;
    cv::resize(img, resized, cv::Size(input_width, input_height));
    resized.convertTo(resized, CV_32F);
    resized /= 255.0f;
    // Convert HWC to CHW
    std::vector<cv::Mat> channels(3);
    cv::split(resized, channels);
    cv::Mat preprocessed_img;
    cv::vconcat(channels, preprocessed_img);
    // Convert img to tensor
    std::vector<float> input_tensor_values(preprocessed_img.begin<float>(), preprocessed_img.end<float>());
    // Create input tensor
    std::vector<int64_t> input_shape = {1, input_channels, input_height, input_width};
    Ort::MemoryInfo memory_info = Ort::MemoryInfo::CreateCpu(OrtArenaAllocator, OrtMemTypeDefault);
    Ort::Value input_tensor = Ort::Value::CreateTensor<float>(memory_info, input_tensor_values.data(), input_tensor_values.size(), input_shape.data(), input_shape.size());
    // Run inference
    auto output_tensors = session.Run(Ort::RunOptions{nullptr}, &input_name, &input_tensor, 1, &output_name, 1);

    // Process the output
    float* output_data = output_tensors.front().GetTensorMutableData<float>();
    const int num_classes = output_tensors.front().GetTensorTypeAndShapeInfo().GetShape()[1];
    // Print the top-1 class
    int max_index = std::distance(output_data, std::max_element(output_data, output_data + num_classes));
    std::string class_name = classes[max_index];
    return class_name;
}

} // namespace facebook::react