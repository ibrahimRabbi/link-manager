# Link Manager UI on Kubernetes
This guide assumes you have a kubernetes cluster running and can communicate with it using Kubectl.
Additionally, you should also have the link-manager-api running. 
 
### Setting up Link Manager UI on Kubernetes

#### 1. Identify Link Manager API URL and OSLC API URLS

- Once your link-manager-api is running, list the services in your cluster 
```bash
$ kubectl get svc
NAME                        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                                                       AGE
discovery-graphdb-neo4j-0   NodePort       10.100.176.193   <none>        5000:31436/TCP,6000:31974/TCP,7000:31071/TCP,3637:30520/TCP   6h36m
discovery-graphdb-neo4j-1   NodePort       10.108.119.26    <none>        5000:31149/TCP,6000:31955/TCP,7000:30904/TCP,3637:32205/TCP   6h36m
discovery-graphdb-neo4j-2   NodePort       10.106.208.211   <none>        5000:31634/TCP,6000:32206/TCP,7000:32713/TCP,3637:30592/TCP   6h36m
gitlab-oslc-api             NodePort       10.102.220.160   <none>        80:31986/TCP                                                  3h35m
glide-oslc-api              NodePort       10.111.50.77     <none>        80:32757/TCP                                                  5d
graphdb-neo4j               NodePort       10.107.2.156     <none>        7474:30441/TCP,7687:31923/TCP,7473:30332/TCP                  6h36m
graphdb-neo4j-replica       NodePort       10.104.133.82    <none>        7474:30775/TCP,7687:31968/TCP,7473:32015/TCP                  6h36m
jira-oslc-api               NodePort       10.110.188.148   <none>        80:32138/TCP                                                  3h35m
keycloak                    LoadBalancer   10.99.147.104    <pending>     8080:31492/TCP                                                5d4h
kubernetes                  ClusterIP      10.96.0.1        <none>        443/TCP                                                       5d5h
link-manager-api            NodePort       10.102.35.87     <none>        80:30723/TCP                                                  6h27m
link-manager-ui             NodePort       10.111.10.253    <none>        81:32070/TCP                                                  8h
modelon-oslc-api            NodePort       10.105.115.248   <none>        80:30733/TCP                                                  4d
```
- Identify the port of the link-manager-api service. In this case it is **30723**
```bash
$ export LM_API_PORT=30723
```
- List nodes in your cluster
```bash
$ kubectl get nodes -o wide
NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
minikube   Ready    control-plane   25h   v1.25.2   192.168.49.2   <none>        Ubuntu 20.04.5 LTS   5.15.0-60-generic   docker://20.10.18
```
- Identify the ip of your cluster. In this case it is **192.168.49.2**
```bash
$ export HOST=192.168.49.2
```
- Construct your link-manager-api url. 
```bash
$ export LM_API_ADDR=http://$HOST:$LM_API_PORT/api/v1
$ echo $LM_API_ADDR
http://192.168.49.2:30723/api/v1
```
- Replace __LM_API_URL__ in link-manager-ui.yaml with its value
```bash
$ sed -i "s|LM_API_URL|$LM_API_ADDR|" link-manager-ui.yaml
```
- Similarly identify the URLs for the OSLC APIs
```bash
$ kubectl get svc
NAME                        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                                                       AGE
discovery-graphdb-neo4j-0   NodePort       10.100.176.193   <none>        5000:31436/TCP,6000:31974/TCP,7000:31071/TCP,3637:30520/TCP   6h36m
discovery-graphdb-neo4j-1   NodePort       10.108.119.26    <none>        5000:31149/TCP,6000:31955/TCP,7000:30904/TCP,3637:32205/TCP   6h36m
discovery-graphdb-neo4j-2   NodePort       10.106.208.211   <none>        5000:31634/TCP,6000:32206/TCP,7000:32713/TCP,3637:30592/TCP   6h36m
gitlab-oslc-api             NodePort       10.102.220.160   <none>        80:31986/TCP                                                  3h35m
glide-oslc-api              NodePort       10.111.50.77     <none>        80:32757/TCP                                                  5d
graphdb-neo4j               NodePort       10.107.2.156     <none>        7474:30441/TCP,7687:31923/TCP,7473:30332/TCP                  6h36m
graphdb-neo4j-replica       NodePort       10.104.133.82    <none>        7474:30775/TCP,7687:31968/TCP,7473:32015/TCP                  6h36m
jira-oslc-api               NodePort       10.110.188.148   <none>        80:32138/TCP                                                  3h35m
keycloak                    LoadBalancer   10.99.147.104    <pending>     8080:31492/TCP                                                5d4h
kubernetes                  ClusterIP      10.96.0.1        <none>        443/TCP                                                       5d5h
link-manager-api            NodePort       10.102.35.87     <none>        80:30723/TCP                                                  6h27m
link-manager-ui             NodePort       10.111.10.253    <none>        81:32070/TCP                                                  8h
modelon-oslc-api            NodePort       10.105.115.248   <none>        80:30733/TCP                                                  4d
$ export JIRA_OSLC_API_PORT=32138
$ export JIRA_OSLC_API_ADDR=http://$HOST:$JIRA_OSLC_API_PORT/
$ export GITLAB_OSLC_API_PORT=31986
$ export GITLAB_OSLC_API_ADDR=http://$HOST:$GITLAB_OSLC_API_PORT/
$ export GLIDE_OSLC_API_PORT=32757
$ export GLIDE_OSLC_API_ADDR=http://$HOST:$GLIDE_OSLC_API_PORT/
```
- Replace the OSLC_URL placeholders in the yaml file. 
```bash
$ sed -i "s|JIRA_OSLC_API|$JIRA_OSLC_API_ADDR|" link-manager-ui.yaml 
$ sed -i "s|GITLAB_OSLC_API|$GITLAB_OSLC_API_ADDR|" link-manager-ui.yaml 
$ sed -i "s|GLIDE_OSLC_API|$GLIDE_OSLC_API_ADDR|" link-manager-ui.yaml
```
#### 2. Run Link Manager UI on kubernetes
- Apply link-manager-ui.yaml 
```bash
$ kubectl apply -f link-manager-ui.yaml
```