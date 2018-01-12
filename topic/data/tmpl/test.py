


def topkek(data):
    for i in range(3):
        if data[i][0] == data[i][1] == data[i][2]:
            return True
        if data[0][i] == data[1][i] == data[2][i]:
            return True
    return (data[0][0] == data[1][1] == data[2][2]
         or data[0][2] == data[1][1] == data[2][0])


def kek(data):
    for i in range(3):
        for j in range(3):
            if data[i][j] not in ['o', 'x']:
                return False
    return True