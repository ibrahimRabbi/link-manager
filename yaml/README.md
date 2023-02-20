# Link Manager UI on Kubernetes
This guide assumes you have a kubernetes cluster running and can communicate with it using Kubectl.
Additionally, you should also have the link-manager-api running. 
 
### Setting up Link Manager UI on Kubernetes

#### 1. Identify Link Manager API URL

- Once your link-manager-api is running, list the services in your cluster 
```bash
$ kubectl get svc
NAME                        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                                                       AGE
discovery-graphdb-neo4j-0   NodePort       10.100.74.199    <none>        5000:31640/TCP,6000:30580/TCP,7000:31469/TCP,3637:32074/TCP   25h
discovery-graphdb-neo4j-1   NodePort       10.108.129.86    <none>        5000:30605/TCP,6000:32159/TCP,7000:30122/TCP,3637:30554/TCP   25h
discovery-graphdb-neo4j-2   NodePort       10.111.176.85    <none>        5000:32542/TCP,6000:30851/TCP,7000:31954/TCP,3637:31772/TCP   25h
graphdb-neo4j               NodePort       10.101.131.183   <none>        7474:30976/TCP,7687:31467/TCP,7473:32111/TCP                  25h
graphdb-neo4j-replica       NodePort       10.99.56.3       <none>        7474:30602/TCP,7687:32213/TCP,7473:31711/TCP                  25h
keycloak                    LoadBalancer   10.102.188.9     <pending>     8080:32103/TCP                                                25h
kubernetes                  ClusterIP      10.96.0.1        <none>        443/TCP                                                       25h
link-manager-api            NodePort       10.108.30.124    <none>        80:32001/TCP                                                  25h                                                 25h
```
- Identify the port of the link-manager-api service. In this case it is **32001**
```bash
$ export LM_API_PORT=32001
```
- List nodes in your cluster
```bash
$ kubectl get nodes -o wide
NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
minikube   Ready    control-plane   25h   v1.25.2   192.168.49.2   <none>        Ubuntu 20.04.5 LTS   5.15.0-60-generic   docker://20.10.18
```
- Identify the ip of your cluster. In this case it is **192.168.49.2**
```bash
$ export LM_API_HOST=192.168.49.2
```
- Construct your link-manager-api url. 
```bash
$ export LM_API_ADDR=http://$LM_API_HOST:$LM_API_PORT/api/v1
$ echo $LM_API_ADDR
http://192.168.49.2:32001/api/v1
```
- Replace __LM_API_URL__ in link-manager-ui.yaml with its value
```bash
$ sed -i "s|LM_API_URL|$LM_API_ADDR|" link-manager-ui.yaml
```
#### 2. Run Link Manager UI on kubernetes
- Apply link-manager-ui.yaml 
```bash
$ kubectl apply -f link-manager-ui.yaml
```