import json
import math
import random


def lambda_handler(event, context):
    if (isinstance(event["body"], str)):  # If the body is a str object then parse to dict
        print(event["body"])
        temp = json.loads(event["body"])
        print(type(temp))
        print("Converted to dict from str")
    elif (isinstance(event["body"], dict)):
        temp = event["body"]

        # TODO implement
    input = temp
    # input = eval(input)
    print(input)
    probabilities = classify(input)
    print(type(json.dumps(probabilities)))
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },

        'body': json.dumps(probabilities)
    }


def mean(numbers):
    return (sum(numbers) / float(len(numbers)))


def stdev(numbers):
    avg = mean(numbers)
    variance = sum([pow(x - avg, 2) for x in numbers]) / float(len(numbers))
    if (variance == 0):
        variance = 0.1
    return math.sqrt(variance)


def totalCount(numbers):
    return (len(numbers))


def separateByClass(dataset):  # Splits the dataset into separate arrays, based on class (Last column)
    separated = {}
    for i in range(len(dataset)):
        vector = dataset[i]
        if (vector[-1] not in separated):
            separated[vector[-1]] = []
        separated[vector[-1]].append(vector)
    return separated


def summarize(dataset):  # For each column/attribute, calculate the mean and stdev and store it as a pair
    summaries = [(mean(attribute), stdev(attribute)) for attribute in zip(*dataset)]
    del summaries[-1]  # Remove the attributes for the last column (Y)
    return summaries


def summarizeByClass(dataset):  # Split the datasets by class, and then calculate the respective summaries
    totalEntries = len(dataset)
    # print("totalentries: "+ str(totalEntries))

    separated = separateByClass(dataset)
    summaries = {}
    for classValue, instances in separated.items():
        summaries[classValue] = summarize(instances)
        # print("Type of summaries classvalue: " + str(type(summaries[classValue])))
        summaries[classValue].append(float(len(instances))/float(totalEntries))
        # print(summaries[classValue][-1])
        print(len(instances))

    return summaries


def calculateProbability(x, mean, stdev):  # Calculate how probability of X of belonging to class with mean and stdev
    if (stdev == 0):
        stdev = 0.01
    exponent = math.exp(-(math.pow(x - mean, 2) / (2 * math.pow(stdev, 2))))
    prob = (1 / (math.sqrt(2 * math.pi) * stdev)) * exponent
    return prob


def calculateLikelihood(x, mean, stdev):
    # Calculate how probability of X of belonging to class with mean and stdev
    if (stdev == 0):
        stdev = 0.01
    exponent = math.exp(-(math.pow(x - mean, 2) / (2 * math.pow(stdev, 2))))
    prob = (1 / (math.sqrt(2 * math.pi) * stdev)) * exponent
    return prob


def calculateClassProbabilities(summaries, inputVector):  # Iterate through x values (input vector)
    print(inputVector)
    probabilities = {}
    priorProb = {}
    # for classValue in summaries.items():
    #     print(classValue)

    for classValue, classSummaries in summaries.items():
        priorProb = summaries[classValue][-1]
        del summaries[classValue][-1]
        probabilities[classValue] = 1
        for i in range(len(classSummaries)):
            mean, stdev = classSummaries[i]
            x = inputVector[i]
            probabilities[classValue] *= calculateProbability(x, mean, stdev)
        probabilities[classValue] = probabilities[classValue] * priorProb
        summaries[classValue].append(priorProb)
    return probabilities


def predict(summaries, inputVector):
    probabilities = calculateClassProbabilities(summaries, inputVector)
    bestLabel, bestProb = None, -1
    for classValue, probability in probabilities.items():
        if bestLabel is None or probability > bestProb:
            bestProb = probability
            bestLabel = classValue
    return bestLabel


def getPredictions(summaries, testSet):
    predictions = []
    for i in range(len(testSet)):
        result = predict(summaries, testSet[i])
        predictions.append(result)
    return predictions


def getAccuracy(testSet, predictions):
    correct = 0
    for x in range(len(testSet)):
        if testSet[x][-1] == predictions[x]:
            correct += 1
    return (correct / float(len(testSet))) * 100.0

def normalize(probabilities):
    totalProb = 0
    for key in probabilities:
        totalProb += probabilities[key]
    for key in probabilities:
        if (totalProb == 0):
            continue
        probabilities[key] = (probabilities[key] / totalProb) * 100.0
    return probabilities


def classify(input):  # Takes in input as a vector: outputs dictionary with normalized probabilities
    summaries = {0: [(0.0, 0.1), (50.0, 10.0), (0.0, 0.1), (0.0, 0.1),0.5],
                 1: [(0.0, 0.1), (250.0, 100.0), (0.0, 0.1), (0.0, 0.1),0.5]}
    probabilities = calculateClassProbabilities(summaries, input)
    probabilities = normalize(probabilities)
    print(probabilities)
    return probabilities



