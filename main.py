print("Quel est ton nom ?\n")
input = nom

age_eleve = 15
age = float(input("Quel est ton âge ?\n"))
print(age,"ans !!!! ,c'est très vieux tout ça\n")

if age > 15: 
  diffage = age - 15
  print("tu es plus vieux de", diffage, "ans")
if age < 15: 
  diffage = 15 - age
  print("tu es plus jeune de", diffage, "ans")
if age == 15: 
  print("on a le même âge")